importUtils = function() {

    function importXMLFile() {

        console.log("Opening file dialog.");

        // Open file dialog
        let fileInput = document.createElement("input");
        fileInput.setAttribute("type", "file");
        fileInput.click();
        fileInput.onchange = e => {
        
            // Read chosen file
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = readerEvent => {
                
                // TODO: error with empty lot file
                let content = readerEvent.target.result;
                content = content.replace('<!DOCTYPE house SYSTEM "blueprint.dtd">', "");

                // Parse XML content
                let dom = parseXML(content);
                if (dom == null) return;

                // Convert XML into json string
                let jsonString = xml2json(dom);

                // Replace undefineds, causes error otherwise
                jsonString = jsonString.replace("undefined", "");

                // Convert json string to json
                let houseObject = JSON.parse(jsonString);
                
                console.log(jsonString);
                console.log(houseObject)
            }
        }
    }

    function parseXML(xml) {

        var dom = null;
        if (window.DOMParser) {
            try { 

                dom = (new DOMParser()).parseFromString(xml, "text/xml"); 
            } 
            catch (e) { dom = null; }
        }
        else if (window.ActiveXObject) {
            try {

                dom = new ActiveXObject('Microsoft.XMLDOM');
                dom.async = false;
                if (!dom.loadXML(xml)) // parse error ..

                window.alert(dom.parseError.reason + dom.parseError.srcText);
            } 
            catch (e) { dom = null; }
        }
        else alert("cannot parse xml string!");

        return dom;
    }

    return {
        importXMLFile: importXMLFile
    }
}();