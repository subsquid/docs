#!/bin/bash

# Usage: rewriteLinks.sh <path_to_log>

IFS=$'\n'
for logLine in `cat $1`; do
	inPath=`echo $logLine | cut -d ' ' -f 1`
	outPath=`echo $logLine | cut -d ' ' -f 3`
	if [[ "$inPath" =~ .*"md"|"mdx"$ ]]; then
		inPathNoExt="${inPath%.*}"
		inPathGrepQuery="](/${inPathNoExt}/\?\(#[^()#]*\)\?)"
		for affectedDocPath in `grep -lr "$inPathGrepQuery" docs/`; do
			if [[ "$outPath" =~ .*"md"|"mdx"$ ]]; then
				outPathNoExt="${outPath%.*}"
				sed -i -e "s/](\/${inPathNoExt//\//\\\/}\(\/\?\)\(#[^()#]*\)\?)/](\/${outPathNoExt//\//\\\/}\1\2)/g" "$affectedDocPath"
			else
				echo WARNING: erasing section information for link to $inPath in file $affectedDocPath - file became a section
				sed -i -e "s/](\/${inPathNoExt//\//\\\/}\(\/\?\)\(#[^()#]*\)\?)/[(\/${outPathNoExt//\//\\\/})/g" "$affectedDocPath"
			fi
		done
	else
		inPathGrepQuery="](/${inPath}/\?)"
		for affectedDocPath in `grep -lr "$inPathGrepQuery" docs/`; do
			if [[ "$outPath" =~ .*"md"|"mdx"$ ]]; then
				outPathNoExt="${outPath%.*}"
			else
				outPathNoExt="$outPath"
			fi
			sed -i -e "s/](\/${inPath//\//\\\/}\(\/\?\))/](\/${outPathNoExt//\//\\\/}\1)/g" "$affectedDocPath"
		done
	fi
done
