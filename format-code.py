#!/usr/bin/env python3

import os
import sys
import begin
import subprocess

@begin.start
def jsfmt (code_dir='.', include="*.js static/js/*.js", format=False):
  os.chdir(code_dir)
  if format:
    cmd = "node node_modules/.bin/jsfmt --write {}".format(include)
    print(cmd)
    subprocess.call(cmd, shell=True)
    
  else:
    cmd = "node node_modules/.bin/jsfmt --list {}".format(include)
    print(cmd)
    process = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    exitcode = process.wait()
    out = process.stdout.read()
    err = process.stderr.read()
    
    if exitcode or out or err:
      if out:
        print('STDOUT')
        print(out.decode('utf-8'))
        
      if err:
        print('STDERR')
        print(err.decode('utf-8'))
        
      print("!!!! Code Not Formatted - Run 'format-code.py --format' !!!!")
      sys.exit(1)
      