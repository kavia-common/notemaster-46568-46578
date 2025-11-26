#!/bin/bash
cd /home/kavia/workspace/code-generation/notemaster-46568-46578/notes_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

