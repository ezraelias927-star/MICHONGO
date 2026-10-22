import cloudinary
import cloudinary.uploader
from flask import current_app

def upload_to_cloudinary(file_obj, folder_name="michongo_posts"):
    """
    Function inayopokea file object, inaunganisha config kupitia Flask current_app,
    kisha inapandisha picha Cloudinary na kurudisha URL yake.
    """
    try:
        # Tunachukua credentials moja kwa moja kutoka kwenye Flask app config
        cloudinary.config(
            cloud_name=current_app.config["CLOUDINARY_CLOUD_NAME"],
            api_key=current_app.config["CLOUDINARY_API_KEY"],
            api_secret=current_app.config["CLOUDINARY_API_SECRET"],
            secure=True
        )

        # Pandisha faili kwenda Cloudinary
        upload_result = cloudinary.uploader.upload(
            file_obj,
            folder=folder_name
        )

        # Rudisha secure URL
        return upload_result.get("secure_url"), None

    except Exception as e:
        return None, str(e)