#!/bin/bash -x

###############################################################################
#
# UpdateFEwithExtensions
#
# Description:  Update files in the FE code based on the content of the
#               extensions.  For this to work, extensions are required to fill
#               some files.  The current script does not care too much about
#               their locations (other than being in the component
#               nodes-modules) but the file name must match.
#
###############################################################################

UpdateFEwithExtensions(){

  # Append statements to src/app/extensibility/index.js
  echo "build.sh --- Appending to src/app/extensibility/index.js"
  extImports=`find -name "extIndex"`
  for i in $extImports; do
    cat $i | grep import > tmp.imports
    cat $i | grep 'components\[' > tmp.components

    sed -i '/Import section/ r tmp.imports' src/app/extensibility/index.js
    sed -i '/Components section/ r  tmp.components' src/app/extensibility/index.js
  done

  # Append Reducers to src/views/extensibility/ExtensibilityReducer.js
  echo "build.sh --- Appending to src/app/extensibility/ExtensibilityReducer.js"
  extRed=`find -name "extensibilityReducer"`
  for i in $extRed; do
    cat $i | grep import | grep -v '{combineReducers}' > tmp.imports.red
    cat $i | grep ".*:.*," > tmp.exports.red

    sed  -i '/import {combineReducers}/ r tmp.imports.red' src/app/extensibility/ExtensibilityReducer.js
    sed  -i '/export default combineReducers/ r  tmp.exports.red' src/app/extensibility/ExtensibilityReducer.js
  done

  # Get extensible json additions
  echo "build.sh --- Appending to resources/views/extensibleViews.json"
  extConfig=`find node_modules/ -name "extensibleViews.json"`
  if [ ! -z "$extConfig" ]; then
    jq -n 'input | . +=[inputs]'  resources/views/extensibleViews.json $extConfig > tmp
    mv tmp resources/views/extensibleViews.json
  fi

  # Append statements to src/app/overlays/OverlayImports.js
  echo "build.sh --- Appending to src/app/overlays/OverlayImports.js"
  extImports=`find -name "OverlayImport.js"`
  for i in $extImports; do
    cat $i | grep import > tmp.overlay.imports
    cat $i | grep 'overlays\[' > tmp.overlays

    sed -i '/Import section/ r tmp.overlay.imports' src/app/overlays/OverlayImports.js
    sed -i '/Overlays section/ r  tmp.overlays' src/app/overlays/OverlayImports.js
  done

  # Get overlay json additions
  echo "build.sh --- Appending to resources/overlays/overlaysDetails.json"
  extConfig=`find node_modules/ -name "overlaysDetails.json"`
  if [ ! -z "$extConfig" ]; then
    jq -n 'input | . +=[inputs]'  resources/overlays/overlaysDetails.json $extConfig > tmp
    mv tmp resources/overlays/overlaysDetails.json
  fi

  # Append scss statements
  echo "build.sh --- Appending to resources/scss/customViews.scss"
  touch resources/scss/customViews.scss
  extSCSS=`find -name "extensibility.scss"`
  for i in $extSCSS; do
    cat $i >> resources/scss/customViews.scss
  done


}

updateStyle()
{
  echo "build.sh --- Updating style"

  echo "build.sh --- adding fonts"
  extFonts=`find extStyle/ -name "fonts"`
  for i in $extFonts; do
    cp -fr $i/* ./resources/fonts/
  done

  echo "build.sh --- adding scss"
  extScss=`find extStyle/ -name "scss"`
  for i in $extScss; do
    cp -fr $i/* ./resources/scss/
  done

  # Append style import to src/app/main.app.jsx
  echo "build.sh --- Append style import to src/app/main.app.jsx"
  extImports=`find extStyle/ -name "main.app.jsx"`
  for i in $extImports; do
    cat $i | grep import > tmp.style.imports
    sed -i '/Import Style Section/ r tmp.style.imports' src/app/main.app.jsx
  done

  if [ -f  tmp.style.imports ]; then
      sed -i /"import 'resources\/scss\/style\.scss';"/d src/app/main.app.jsx
  fi

  # Update bootstrap
  echo "build.sh --- Update resources/scss/bootstrap.scss"
  bootImports=`find extStyle/ -name "bootstrap.scss"`
  for i in $bootImports; do
    cat $i | grep import > tmp.bootstrap.import
    sed -i '/Import Typography Section/ r tmp.bootstrap.import' resources/scss/bootstrap.scss
  done

  if [ -f  tmp.bootstrap.import ]; then
      sed -i /"@import \"common\/typography\";"/d resources/scss/bootstrap.scss
  fi
}

UpdateFEWithCustomViews(){
  # Append statements to src/app/configurableViews/index.js
  echo "build.sh --- Appending to src/app/configurableViews/index.js"
  custViewImports=`find -name "confViewIndex"`
  for i in $custViewImports; do
    cat $i | grep import > tmp.imports
    cat $i | grep 'components\[' > tmp.components

    sed -i '/Import section/ r tmp.imports' src/app/configurableViews/index.js
    sed -i '/Components section/ r  tmp.components' src/app/configurableViews/index.js
  done
}

###############################################################################
#
# Main
#
###############################################################################

# Copy some extension content to the core sparky
UpdateFEwithExtensions

# Copy style
updateStyle

