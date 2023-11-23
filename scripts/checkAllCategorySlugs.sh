#!/bin/bash

IFS=$'\n'
for catDir in `find docs -type d ! -name 'docs'`; do
	catFile="${catDir}/_category_.json"
	if [ -f "$catFile" ]; then
		slugDir=`cat "$catFile" | jq -r .link.slug`
		if [[ "docs${slugDir}" != "$catDir" ]]; then
			echo Wrong slug $slugDir at $catFile
		fi
	else
		echo No _category_.json at $catDir
	fi
done
