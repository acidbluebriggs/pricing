#!/bin/bash
# bust_that_cache.sh
TIMESTAMP=$(date +%s)
sed -i '' "s/css\/style\.css?v=[0-9]*/css\/style.css?v=$TIMESTAMP/g" pricing/index.html
sed -i '' "s/js\/app\.js?v=[0-9]*/js\/app.js?v=$TIMESTAMP/g" pricing/index.html
sed -i '' "s/js\/formulas\.js?v=[0-9]*/js\/formulas.js?v=$TIMESTAMP/g" pricing/index.html
sed -i '' "s/sw\.js?v=[0-9]*/sw.js?v=$TIMESTAMP/g" pricing/index.html
echo "✅ Cache busting updated with timestamp: $TIMESTAMP"
