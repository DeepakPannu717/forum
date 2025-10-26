# models/forum_model.py

from db import db
from bson import ObjectId

def get_full_forum():
    categories = list(db.categories.find())
    topics = list(db.topics.find())

    # Build map of categories and initialize fields
    cat_map = {}
    for cat in categories:
        cid = str(cat["_id"])
        cat_map[cid] = {**cat, "_id": cid, "topics": [], "subcategories": []}

    # Attach topics to categories
    for topic in topics:
        try:
            cat_id = str(topic.get("categoryId"))
        except Exception:
            # skip malformed topic
            continue
        if cat_id in cat_map:
            cat_map[cat_id]["topics"].append({
                "_id": str(topic["_id"]),
                "name": topic["name"],
                "language": topic.get("language", ""),
                "codebase": topic.get("codebase", ""),
                "output": topic.get("output", ""),
                "status": topic.get("status", "")
            })

    # Build tree by parentId
    roots = []
    for cid, cat in cat_map.items():
        parent = cat.get("parentId")
        if parent:
            parent_str = str(parent)
            if parent_str in cat_map:
                cat_map[parent_str]["subcategories"].append(cat)
            else:
                roots.append(cat)
        else:
            roots.append(cat)

    return roots
