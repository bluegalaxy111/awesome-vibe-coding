import re
import json

def parse_readme():
    with open("README.md", "r") as f:
        lines = f.readlines()
        
    intro_lines = []
    categories = []
    current_category = None
    current_subcategory = None
    
    # Find the line index of "## AI Coding Agents" which is the first real category
    first_cat_idx = 0
    for i, line in enumerate(lines):
        if line.strip() == "## AI Coding Agents":
            first_cat_idx = i
            break
            
    intro_lines = lines[:first_cat_idx]
    content_lines = lines[first_cat_idx:]
    
    for line in content_lines:
        if line.startswith("## "):
            current_category = {"name": line.strip()[3:], "description": [], "subcategories": [], "tools": []}
            categories.append(current_category)
            current_subcategory = None
        elif line.startswith("### "):
            current_subcategory = {"name": line.strip()[4:], "description": [], "tools": []}
            current_category["subcategories"].append(current_subcategory)
        elif line.startswith("- ["):
            match = re.match(r'- \[(.*?)\]\((.*?)\)(.*)', line.strip())
            if match:
                name = match.group(1)
                url = match.group(2)
                rest = match.group(3).strip()
                
                if rest.startswith("-"):
                    rest = rest[1:].strip()
                
                tags = []
                tag_match = re.search(r'\*\((.*?)\)\*', rest)
                if tag_match:
                    tags = [t.strip() for t in tag_match.group(1).split(',')]
                    rest = rest.replace(f"*({tag_match.group(1)})*", "").strip()
                
                personal_pick = ""
                pick_match = re.search(r'\*Personal pick - (.*?)\*', rest)
                if pick_match:
                    personal_pick = pick_match.group(1).strip()
                    rest = rest.replace(f"*Personal pick - {pick_match.group(1)}*", "").strip()
                
                tool = {
                    "name": name,
                    "url": url,
                    "description": rest,
                    "tags": tags,
                    "personal_pick": personal_pick
                }
                
                if current_subcategory:
                    current_subcategory["tools"].append(tool)
                else:
                    current_category["tools"].append(tool)
            else:
                 if current_subcategory:
                     current_subcategory['description'].append(line)
                 else:
                     current_category['description'].append(line)
        else:
            if current_subcategory:
                current_subcategory["description"].append(line)
            elif current_category:
                current_category["description"].append(line)

    for c in categories:
        c["description"] = "".join(c["description"]).strip()
        for s in c["subcategories"]:
            s["description"] = "".join(s["description"]).strip()
            
    import os
    os.makedirs("data", exist_ok=True)
    with open("docs/data/tools.json", "w") as f:
        json.dump({"categories": categories}, f, indent=2)
        
    with open("data/template.md", "w") as f:
        f.writelines(intro_lines)

parse_readme()
