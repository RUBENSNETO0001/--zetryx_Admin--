from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector.pooling
import os
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', './uploads')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

DB_CONFIG = {
    "host":     os.getenv("DB_HOST", "localhost"),
    "user":     os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "Sistema_zetryx"),
    "charset":  "utf8mb4",
}

db_pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name="zetryx_pool",
    pool_size=5,
    **DB_CONFIG
)

def get_db():
    return db_pool.get_connection()

@app.route('/api/participantes', methods=['GET'])
def listar_participantes():
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
        cursor.close()
        conn.close()

@app.route('/api/participantes/<int:id>/status', methods=['PATCH'])
def atualizar_status(id):
    data = request.get_json()
    novo_status = data.get('status')
    if novo_status not in ('Novo', 'Revisando', 'Finalizado'):
        return jsonify({"error": "Status inválido"}), 400
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
        cursor.close()
        conn.close()