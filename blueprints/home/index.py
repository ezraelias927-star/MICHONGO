from flask import Blueprint, Response

indexer_bp = Blueprint("indexer", __name__)

@indexer_bp.route('/sitemap.xml', methods=['GET'])
def sitemap():
    sitemap_xml = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    
    <!-- Ukurasa Mkuu (Homepage) -->
    <url>
        <loc>https://michongo.dig.co.tz/</loc>
        <lastmod>2026-10-24</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>

    <!-- Ukurasa wa Kujisajili -->
    <url>
        <loc>https://michongo.dig.co.tz/auth/register</loc>
        <lastmod>2026-10-24</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>

    <!-- Ukurasa wa Kuingia (Login) -->
    <url>
        <loc>https://michongo.dig.co.tz/auth/login</loc>
        <lastmod>2026-10-24</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>

    <!-- Ukurasa wa kupakia pdf -->
        <url>
            <loc>https://michongo.dig.co.tz/api/books</loc>
            <lastmod>2026-10-30</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.8</priority>
        </url>
    

</urlset>"""

    return Response(sitemap_xml, mimetype='application/xml')