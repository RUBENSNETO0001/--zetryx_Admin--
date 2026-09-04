from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import mysql.connector.pooling
import os
import uuid
from datetime import datetime
from pathlib import Path

app = Flask(__name__)

# Configuração de CORS para permitir origens do .env
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173, https://zetryx-admin.netlify.app/").split(",")
CORS(app, origins=[o.strip() for o in origins])

caminho_uploads = Path.home() / "uploads"

from exportar import exportar_bp      
app.register_blueprint(exportar_bp) 
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', caminho_uploads := Path(BASE_DIR) / "uploads")

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = int(os.getenv('MAX_UPLOAD_MB', 16)) * 1024 * 1024

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

DB_CONFIG = {
    "host":     os.getenv("DB_HOST", "mysql.railway.internal"),
    "port":     int(os.getenv("DB_PORT", 3306)),
    "user":     os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", "jFOKuuIIFpfhNAFUNgiKknBrxlbCXXLv"),
    "database": os.getenv("DB_NAME", "railway"),
    "charset":  "utf8mb4",
}

# Inicialização segura do pool para evitar crash na subida
db_pool = None
try:
    db_pool = mysql.connector.pooling.MySQLConnectionPool(
        pool_name="zetryx_pool",
        pool_size=5,
        **DB_CONFIG
    )
except Exception as err:
    print(f"[AVISO] Não foi possível conectar ao banco de dados na inicialização: {err}")

def get_db():
    if not db_pool:
        raise Exception("Pool de conexões do MySQL não está disponível. Verifique o DB_HOST no .env.")
    return db_pool.get_connection()


@app.route('/uploads/<path:filename>', methods=['GET'])
def servir_upload(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/api/participantes', methods=['GET'])
def listar_participantes():
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT 
                id_participante,
                matricula,
                nome_completo,
                modalidade_auxilio,
                status
            FROM Participante
            ORDER BY data_cadastro DESC
        """)
        participantes = cursor.fetchall()
        return jsonify(participantes), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()


@app.route('/api/participantes/<int:id>/status', methods=['PATCH'])
def atualizar_status(id):
    data = request.get_json()
    novo_status = data.get('status')
    if novo_status not in ('Novo', 'Revisando', 'Finalizado'):
        return jsonify({"error": "Status inválido"}), 400
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE Participante SET status = %s WHERE id_participante = %s",
            (novo_status, id)
        )
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"error": "Participante não encontrado"}), 404
        return jsonify({"ok": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()


@app.route('/api/participantes/<int:id>/completo', methods=['GET'])
def participante_completo(id):
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM Participante WHERE id_participante = %s", (id,))
        participante = cursor.fetchone()
        if not participante:
            return jsonify({"error": "Não encontrado"}), 404

        cursor.execute("SELECT * FROM Endereco_participante WHERE id_participante = %s", (id,))
        endereco = cursor.fetchone()

        cursor.execute("SELECT * FROM Curso WHERE id_participante = %s", (id,))
        curso = cursor.fetchone()

        cursor.execute("SELECT * FROM Matricula WHERE id_participante = %s", (id,))
        matricula = cursor.fetchone()

        cursor.execute("SELECT * FROM Dados_Socioeconomicos WHERE id_participante = %s", (id,))
        socio = cursor.fetchone()

        beneficios = None
        if socio:
            cursor.execute("SELECT * FROM Participante_Beneficios WHERE id_socio = %s", (socio['id_socio'],))
            beneficios = cursor.fetchone()

        cursor.execute("SELECT * FROM perfil_declaracao WHERE id_participante = %s", (id,))
        declaracoes = cursor.fetchone()

        cursor.execute("SELECT * FROM Perfil_requisitos WHERE id_participante = %s", (id,))
        requisitos = cursor.fetchone()

        cursor.execute("""
            SELECT
                mf.id_membro, mf.nome, mf.parentesco, mf.data_nascimento,
                mp.profissao, mp.vinculo_empregaticio,
                mr.renda_mensal,
                ms.possui_deficiencia, ms.possui_doenca_cronica
            FROM Membros_Familia mf
            LEFT JOIN Membro_Profissional mp ON mp.id_membro = mf.id_membro
            LEFT JOIN Membro_Renda mr ON mr.id_membro = mf.id_membro
            LEFT JOIN Membro_Saude ms ON ms.id_membro = mf.id_membro
            WHERE mf.id_participante = %s
        """, (id,))
        membros = cursor.fetchall()

        cursor.execute("""
            SELECT db.*, bo.nome_instituicao
            FROM Dados_Bancarios db
            JOIN Banco_Oficiais bo ON bo.id_bancoOf = db.id_bancoOf
            WHERE db.id_participante = %s
        """, (id,))
        bancario = cursor.fetchone()

        cursor.execute("SELECT * FROM Pdf_Participante WHERE id_participante = %s", (id,))
        docs_raw = cursor.fetchall()
        documentos = []
        for d in docs_raw:
            caminho = d.get('url_imagemDocumento') or ''
            documentos.append({
                **d,
                'url': f"{caminho}" if caminho else None,
            })

        return jsonify({
            "participante": participante,
            "endereco": endereco,
            "curso": curso,
            "matricula": matricula,
            "socioeconomico": socio,
            "beneficios": beneficios,
            "declaracoes": declaracoes,
            "requisitos": requisitos,
            "membros": membros,
            "bancario": bancario,
            "documentos": documentos,
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()


@app.route('/api/documentos/<int:id>/validacao', methods=['PATCH', 'OPTIONS'])
def validar_documento(id):
    if request.method == 'OPTIONS':
        return '', 204
    data = request.get_json()
    status = data.get('status')
    justificativa = data.get('justificativa', '')

    if status not in ('aprovado', 'recusado'):
        return jsonify({"error": "Status inválido. Use 'aprovado' ou 'recusado'"}), 400

    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE Pdf_Participante
            SET status_validacao = %s, justificativa_rejeicao = %s
            WHERE id_pdf = %s
        """, (status, justificativa if status == 'recusado' else None, id))
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"error": "Documento não encontrado"}), 404
        return jsonify({"ok": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()


def calcular_pontuacao(id_participante, conn):
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT renda_per_capita, escolaridade FROM Perfil_requisitos WHERE id_participante = %s", (id_participante,))
    req = cursor.fetchone()
    renda = float(req['renda_per_capita']) if req and req['renda_per_capita'] else None
    if renda is None:       pts_renda = 0
    elif renda <= 202:      pts_renda = 40
    elif renda <= 404:      pts_renda = 35
    elif renda <= 607:      pts_renda = 30
    elif renda <= 809:      pts_renda = 25
    elif renda <= 1011:     pts_renda = 20
    elif renda <= 1213:     pts_renda = 15
    elif renda <= 1415:     pts_renda = 10
    elif renda <= 1621:     pts_renda = 5
    else:                   pts_renda = 0

    pts_escolaridade = 40 if req and req.get('escolaridade') == 'publica' else 0

    cursor.execute("SELECT * FROM perfil_declaracao WHERE id_participante = %s", (id_participante,))
    decl = cursor.fetchone() or {}
    pts_lei_cotas                = 40 if decl.get('lei_cotas') else 0
    pts_deficiencia_participante = 40 if decl.get('possui_deficiencia') else 0
    pts_quilombola               = 40 if decl.get('origem_quilombola') else 0
    pts_estrangeiro              = 40 if decl.get('estrangeiro') else 0

    cursor.execute("SELECT tipo_moradia, mora_em FROM Dados_Socioeconomicos WHERE id_participante = %s", (id_participante,))
    socio = cursor.fetchone() or {}
    pts_aluguel    = 10 if socio.get('tipo_moradia') == 'alugada_financiada' else 0
    pts_zona_rural = 10 if socio.get('mora_em') == 'rural' else 0

    cursor.execute("""
        SELECT ms.possui_deficiencia, ms.possui_doenca_cronica
        FROM Membro_Saude ms
        JOIN Membros_Familia mf ON mf.id_membro = ms.id_membro
        WHERE mf.id_participante = %s
    """, (id_participante,))
    saudes = cursor.fetchall()
    pts_deficiencia_familia    = 10 if any(s['possui_deficiencia'] for s in saudes) else 0
    pts_doenca_cronica_familia = 10 if any(s['possui_doenca_cronica'] for s in saudes) else 0

    cursor.execute("""
        SELECT pb.recebe_auxilio_bolsa, pb.beneficiario_bolsa_familia_cadunico, pb.recebe_bpc
        FROM Participante_Beneficios pb
        JOIN Dados_Socioeconomicos ds ON ds.id_socio = pb.id_socio
        WHERE ds.id_participante = %s
    """, (id_participante,))
    benef = cursor.fetchone() or {}
    pts_beneficio_social = 10 if (
        benef.get('recebe_auxilio_bolsa') or
        benef.get('beneficiario_bolsa_familia_cadunico') or
        benef.get('recebe_bpc')
    ) else 0

    cursor.close()
    return {
        'pts_renda': pts_renda,
        'pts_escolaridade': pts_escolaridade,
        'pts_lei_cotas': pts_lei_cotas,
        'pts_deficiencia_participante': pts_deficiencia_participante,
        'pts_quilombola': pts_quilombola,
        'pts_estrangeiro': pts_estrangeiro,
        'pts_aluguel': pts_aluguel,
        'pts_zona_rural': pts_zona_rural,
        'pts_deficiencia_familia': pts_deficiencia_familia,
        'pts_doenca_cronica_familia': pts_doenca_cronica_familia,
        'pts_beneficio_social': pts_beneficio_social,
    }


def classificar(total):
    if total >= 219:   return 'Vulnerabilidade I'
    elif total >= 146: return 'Vulnerabilidade II'
    elif total >= 73:  return 'Vulnerabilidade III'
    else:              return 'Não prioritário'


PONTUACAO_MAX = 290
PONTUACAO_MIN = 0
 
 
def clamp_total(total):
    return max(PONTUACAO_MIN, min(total, PONTUACAO_MAX))

@app.route('/api/participantes/<int:id>/pontuacao', methods=['GET'])
def get_pontuacao(id):
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Pontuacao_Participante WHERE id_participante = %s", (id,))
        row = cursor.fetchone()
        if not row:
            pts = calcular_pontuacao(id, conn)
            subtotal = sum(pts.values())
            total = subtotal
            classif = classificar(total)
            cursor2 = conn.cursor()
            cursor2.execute("""
                INSERT INTO Pontuacao_Participante
                (id_participante, pts_renda, pts_escolaridade, pts_lei_cotas,
                 pts_deficiencia_participante, pts_quilombola, pts_estrangeiro,
                 pts_aluguel, pts_zona_rural, pts_deficiencia_familia,
                 pts_doenca_cronica_familia, pts_beneficio_social,
                 pontuacao_total, classificacao)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            """, (id, pts['pts_renda'], pts['pts_escolaridade'], pts['pts_lei_cotas'],
                  pts['pts_deficiencia_participante'], pts['pts_quilombola'], pts['pts_estrangeiro'],
                  pts['pts_aluguel'], pts['pts_zona_rural'], pts['pts_deficiencia_familia'],
                  pts['pts_doenca_cronica_familia'], pts['pts_beneficio_social'],
                  total, classif))
            conn.commit()
            cursor2.close()
            cursor.execute("SELECT * FROM Pontuacao_Participante WHERE id_participante = %s", (id,))
            row = cursor.fetchone()
        return jsonify(row), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()


@app.route('/api/participantes/<int:id>/pontuacao', methods=['PATCH'])
def salvar_ajuste(id):
    data = request.get_json()
    ajuste = data.get('ajuste_manual', 0)
    obs = data.get('observacao_ajuste', '')
    conn = None
    cursor = None
    try:
        conn = get_db()
        pts = calcular_pontuacao(id, conn)
        subtotal = sum(pts.values())
        total = clamp_total(subtotal + ajuste)
        classif = classificar(total)
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE Pontuacao_Participante
            SET ajuste_manual = %s, observacao_ajuste = %s,
                pontuacao_total = %s, classificacao = %s
            WHERE id_participante = %s
        """, (ajuste, obs, total, classif, id))
        conn.commit()
        return jsonify({"ok": True, "pontuacao_total": total, "classificacao": classif}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()


if __name__ == '__main__':
    porta = int(os.getenv("PORT", 5000))
    debug_mode = os.getenv("FLASK_DEBUG", "true").lower() == "true"
    app.run(host="0.0.0.0", debug=debug_mode, port=porta)