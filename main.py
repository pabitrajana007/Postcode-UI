from flask import Flask, request, jsonify
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from flask_cors import CORS
import os

# Load environment variables from .env file
load_dotenv()

# Create a SQLAlchemy engine
db_name = os.getenv("DB_NAME")
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")

engine = create_engine(f"postgresql://{db_user}:{db_password}@{db_host}/{db_name}")


# Create a session
Session = sessionmaker(bind=engine)

# app = Flask(__name__)

# Initialize Flask App with CORS
app = Flask(__name__)
CORS(app)

@app.route("/postcodes", methods=["POST"])
def postcode_details():
    """
    A function that handles a POST request to the root endpoint ("/") of the application.

    Parameters:
    - None

    Returns:
    - A JSON response containing data related to the postcodes entered by the user.

    Raises:
    - ValueError: If an invalid value is encountered during the execution of the function.
    - KeyError: If a key error occurs during the execution of the function.
    - TypeError: If a type error occurs during the execution of the function.
    """
    try:
        # Get the JSON payload from the request
        data = request.get_json()

        # Extract the postcodes from the JSON payload
        postcodes_input = data.get("postcodes", "")

        # Split the input on commas to extract individual postcodes
        postcodes = postcodes_input.split(",")

        # Check if there are more than 5 postcodes
        if len(postcodes) > 5:
            return jsonify({"error": "You entered more than 5 postcodes."}), 400

        # Create a session
        session = Session()

        response_data = {}

        for postcode in postcodes:
            # Strip leading and trailing spaces from the postcode
            postcode = postcode.strip()

            # Check if the postcode is a number having 4-digits
            if not postcode.isdigit() or len(postcode) != 4:
                error_message = f"Invalid postcode: {postcode}. Please enter a 4-digit numeric value."
                response_data[postcode] = {"error": error_message}
            else:
                # Use SQLAlchemy to execute the query
                query = text(
                    """
                    SELECT *
                    FROM postcode_db
                    WHERE postcode = :postcode
                    """
                )

                result = session.execute(query, {"postcode": postcode})

                postcode_data = []

                for row in result:
                    keys = ["Postcode", "Locality", "State"]
                    values = row
                    table_dict = dict(zip(keys, values))
                    postcode_data.append(table_dict)

                if not postcode_data:
                    error_message = f"404, Postcode {postcode} not found in the database"
                    response_data[postcode] = {"error": error_message}
                else:
                    response_data[postcode] = postcode_data

        session.close()

        # Return the JSON response
        return jsonify(response_data)

    except (ValueError, KeyError, TypeError) as e:
        # Handle specific exceptions
        error_message = str(e)
        return jsonify({"error": error_message}), 500


@app.route("/hello", methods=["GET"])
def display_form():
    """
    Display the form for entering postcodes.

    Returns:
        str: The HTML form for entering postcodes.
    """
    # If it's a GET request, display the form
    return """
        Welcome to Postcode API!
    """

# @app.route("/", methods=["GET"])
# def display_form():
#     """
#     Display the form for entering postcodes.

#     Returns:
#         str: The HTML form for entering postcodes.
#     """
#     # If it's a GET request, display the form
#     return """
#     <form method="post">
#         <label for="postcodes">Enter postcodes (comma-separated):</label>
#         <input type="text" id="postcodes" name="postcodes" required>
#         <input type="submit" value="Submit">
#     </form>
#     """


@app.route("/", methods=["POST"])
def scrape():
    """
    A function that handles a POST request to the root endpoint ("/") of the application.

    Parameters:
    - None

    Returns:
    - A JSON response containing data related to the postcodes entered by the user.
    
    Raises:
    - ValueError: If an invalid value is encountered during the execution of the function.
    - KeyError: If a key error occurs during the execution of the function.
    - TypeError: If a type error occurs during the execution of the function.
    """
    try:
        # Get the comma-separated postcodes from the user input
        postcodes_input = request.form.get("postcodes")

        # Split the input on commas to extract individual postcodes
        postcodes = postcodes_input.split(",")

        # Check if there are more than 5 postcodes
        if len(postcodes) > 5:
            return jsonify({"error": "You entered more than 5 postcodes."}), 400

        # Create a session
        session = Session()

        response_data = {}

        for postcode in postcodes:
            # Strip leading and trailing spaces from the postcode
            postcode = postcode.strip()

            # Check if the postcode is a number having 4-digits
            if not postcode.isdigit() or len(postcode) != 4:
                error_message = f"Invalid postcode: {postcode}. Please enter a 4-digit numeric value."
                response_data[postcode] = {"error": error_message}
            else:
                # Use SQLAlchemy to execute the query
                query = text(
                    """
                SELECT *
                FROM postcode_db
                WHERE postcode = :postcode
                """
                )

                result = session.execute(query, {"postcode": postcode})

                postcode_data = []

                for row in result:
                    keys = ["Postcode", "Locality", "State"]
                    values = row
                    table_dict = dict(zip(keys, values))
                    postcode_data.append(table_dict)

                if not postcode_data:
                    error_message = (
                        f"404, Postcode {postcode} not found in the database"
                    )
                    response_data[postcode] = {"error": error_message}
                else:
                    response_data[postcode] = postcode_data

        session.close()

        # Return the JSON response
        return jsonify(response_data)

    except (ValueError, KeyError, TypeError) as e:
        # Handle specific exceptions
        error_message = str(e)
        return jsonify({"error": error_message}), 500




if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)

