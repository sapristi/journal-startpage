#! /usr/bin/env python
import requests
import sys
import json


selected_languages = ["af","ak","am","ar","as","az","be","bg","bho","bm","bn","bo","br","ca","ce","cs","cv","cy","da","de","dz","ee","el","en","eo","es","et","eu","fa","ff","fi","fo","fr","fy","ga","gd","gl","gu","gv","ha","he","hi","hu","hy","ia","ig","ii","is","it","ja","yi","jv","ka","ki","kk","kl","km","kn","ko","ks","ku","kw","ky","lb","lg","ln","lo","lt","lu","lv","mg","mi","mk","ml","mn","ro","mr","ms","mt","my","nd","ne","nl","no","om","or","os","pa","pl","ps","pt","qu","rm","rn","ru","rw","sa","sc","sd","se","sg","sr-Latn","si","sk","sl","sn","so","sq","su","sv","sw","ta","te","tg","th","ti","tk","fil","to","tr","tt","ug","uk","ur","uz","vi","wo","xh","yo","zh","zu","agq","asa","ast","bas","bem","bez","bgc","brx","ccp","ceb","cgg","chr","dav","dje","doi","fa-AF","dsb","dua","dyo","ebu","ewo","fur","gsw","guz","haw","hsb","jgo","jmc","kab","kam","kde","kea","kgp","khq","kkj","kln","kok","ksb","ksf","ksh","lag","lkt","lrc","luo","luy","mai","mas","mer","mfe","mgh","mgo","mni","mua","mzn","naq","nmg","nnh","nus","nyn","pcm","raj","rof","rwk","sah","saq","sat","sbp","seh","ses","shi","smn","teo","twq","tzm","vai","vun","wae","xog","yav","yrl","zgh"]

def parse_entry(entry):
     res = {}
     lines = entry.splitlines(keepends=False)
     for line in lines:
         if not line:
             continue
         if not ": " in line:
             res[k] += line
             continue
         split_values = line.split(": ", 1)
         if len(split_values) != 2:
             print(f"Failed with ({len(split_values)})\n", entry, file=sys.stderr)
             print(f"--{line}--", file=sys.stderr)
             continue
         k, v = split_values
         res[k] = v
     return res


full_response = requests.get("https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry")

entries_raw = full_response.text.split("%%")

entries = [parse_entry(entry) for entry in entries_raw]

res = {
    entry["Subtag"]: entry["Description"].replace("\n", " ")
    for entry in entries
    if "Subtag" in entry
    and entry["Subtag"] in selected_languages
    and entry["Type"] == "language"
    and not "Macrolanguage" in entry
    and not "Private use" in entry["Description"]
}

print(json.dumps(res))
