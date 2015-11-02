#!/bin/bash

FOO=`dirname $1`
DIR=`basename $FOO`
FILE=`basename $1`

echo "$FOO -> $DIR + $FILE"
echo ""

if (test "$DIR.js" == $FILE)
then
	mv $1 $FOO/module.js
else
	if (test "$DIR.config.js" == $FILE)
	then
		mv $1 $FOO/config.js
	else
		if (test "$DIR.run.js" == $FILE)
		then
			mv $1 $FOO/run.js
		else
			echo "Zot..."
		fi
	fi
fi

