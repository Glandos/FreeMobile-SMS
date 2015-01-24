#!/usr/bin/env python3

import requests

from flask import Flask
from flask import render_template, jsonify, request

from config import users

app = Flask(__name__)

@app.route('/')
def main_page():
    return render_template('send_sms.html', dests=users.keys())

@app.route('/send', methods=['POST'])
def send():
    text = request.form['text']
    dest = request.form['dest']
    exp = request.form['from'] if 'from' in request.form else None
    user, key = users.get(dest, (None, None))
    if user and text:
        if exp:
            text = '{}: {}'.format(exp, text)
        # The doc says that POST is supported, but test says it is not.
        r = requests.get('https://smsapi.free-mobile.fr/sendmsg',
                          params={'user': user, 'pass': key, 'msg': text}
                         )
        return jsonify(code=r.status_code)
    return jsonify(code=400)

if __name__ == '__main__':
    app.run(debug=True)
