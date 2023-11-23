#!/bin/bash

# Usage: redirectAddNewOnes.sh <path_to_log>

IFS=$'\n'
for logLine in `cat $1`; do
	inPath=`echo $logLine | cut -d ' ' -f 1`
	outPath=`echo $logLine | cut -d ' ' -f 3`
	if [[ "$inPath" =~ .*"md"|"mdx"$ ]]; then
		inPathNoExt="${inPath%.*}"
  else
    inPathNoExt="$inPath"
  fi
	if [[ "$outPath" =~ .*"md"|"mdx"$ ]]; then
		outPathNoExt="${outPath%.*}"
	else
		outPathNoExt="$outPath"
	fi
	sed -i -e "N;s/    }\n]/    },\n    {\n        \"from\": \"\/${inPathNoExt//\//\\\/}\",\n        \"to\": \"\/${outPathNoExt//\//\\\/}\"\n    }\n]/" redirectRules.js
done
