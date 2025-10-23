
import os
import sys
from pymongo import MongoClient
from dotenv import load_dotenv

# Añade el directorio del proyecto a la ruta para que se pueda encontrar el paquete lock_person
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from lock_person import create_app

def promote_user_to_admin(email):
    """
    Busca un usuario por su correo electrónico y actualiza su rol a 'admin'.
    """
    app = create_app()
    with app.app_context():
        db = app.db

        # Busca al usuario por su email
        user = db.users.find_one({"email": email})

        if not user:
            print(f"Error: No se encontró ningún usuario con el correo '{email}'.")
            return

        # Actualiza el rol del usuario a 'admin'
        result = db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"role": "admin"}}
        )

        if result.modified_count > 0:
            print(f"¡Éxito! El usuario '{email}' ha sido promovido a administrador.")
        else:
            print(f"Información: El usuario '{email}' ya es administrador o ocurrió un error.")

if __name__ == "__main__":
    # Se espera que el email se pase como un argumento de la línea de comandos
    if len(sys.argv) != 2:
        print("Uso: python promote_user.py <email_del_usuario>")
        sys.exit(1)

    user_email = sys.argv[1]
    promote_user_to_admin(user_email)
