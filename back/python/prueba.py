import json 

route= '../data.json'

with open(route) as file:
    data = json.load(file)
for pregunta in data['preguntes']:
    print(pregunta['preguntes'])
    for resposta in pregunta['respostes']:
        print(resposta['respostes'])
        if (resposta == pregunta['resposta'][pregunta['correcta']]):
            print(resposta, "Correcte")
        else:
            print(resposta, "Incorrecte")