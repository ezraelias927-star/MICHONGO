from flask import Blueprint, request, jsonify
from database import db, PDFBook, Pdfcategory

books_bp = Blueprint('books_api', __name__)

@books_bp.route('/api/books', methods=['GET'])
def get_books():
    # 1. Chukua vigezo kutoka kwenye URL
    category_id = request.args.get('category_id')
    search_query = request.args.get('q')

    # 2. Anzisha query ikifanya JOIN na Table ya Category
    query = db.session.query(PDFBook).join(Pdfcategory)

    # 3. Kama amebofya Category maalum
    if category_id:
        query = query.filter(PDFBook.category_id == category_id)

    # 4. Kama ametumia Search Box (Inatafuta kwenye Title YA Kitabu NA Name YA Category)
    if search_query:
        search_pattern = f"%{search_query}%"
        query = query.filter(
            db.or_(
                PDFBook.title.ilike(search_pattern),
                Pdfcategory.name.ilike(search_pattern)
            )
        )

    # 5. Leta matokeo
    books = query.all()

    # 6. Badilisha data ziwe JSON
    books_data = []
    for book in books:
        books_data.append({
            "id": book.id,
            "title": book.title,
            "file_url": book.file_path,
            "category_id": book.category_id,
            "category_name": book.category.name  # Inaleta na jina la kategoria moja kwa moja!
        })

    return jsonify({
        "success": True,
        "count": len(books_data),
        "data": books_data
    }), 200