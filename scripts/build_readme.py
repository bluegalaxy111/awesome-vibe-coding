import json

def build_readme():
    with open("docs/data/template.md", "r") as f:
        intro = f.read()
        
    with open("docs/data/tools.json", "r") as f:
        data = json.load(f)
        
    out = intro
    if not out.endswith('\n'):
        out += '\n'
        
    for cat in data["categories"]:
        out += f"## {cat['name']}\n\n"
        if cat["description"]:
            out += f"{cat['description']}\n\n"
            
        if cat["subcategories"]:
            for sub in cat["subcategories"]:
                out += f"### {sub['name']}\n\n"
                if sub["description"]:
                    out += f"{sub['description']}\n\n"
                for tool in sub["tools"]:
                    out += format_tool(tool)
        else:
            for tool in cat["tools"]:
                out += format_tool(tool)
        
        # Don't add a separator after the last category if it's not needed,
        # but in awesome lists there is usually a "Ways to contribute" or something at the end.
        
    with open("README.md", "w") as f:
        f.write(out)

def format_tool(tool):
    line = f"- [{tool['name']}]({tool['url']})"
    if tool['description']:
        line += f" - {tool['description']}"
        
    if tool['personal_pick']:
        line += f" *Personal pick - {tool['personal_pick']}*"
        
    if tool['tags']:
        formatted_tags = []
        for t in tool['tags']:
            # Title case and replace hyphens for cleaner look (e.g. open-source -> Open Source)
            clean_tag = t.strip().replace('-', ' ').title()
            # Fix capitalization for specific words if needed (e.g. Mac)
            clean_tag = clean_tag.replace('Mac Only', 'Mac')
            formatted_tags.append(f"**[{clean_tag}]**")
        line += " " + " ".join(formatted_tags)
        
    return line + "\n"

build_readme()
