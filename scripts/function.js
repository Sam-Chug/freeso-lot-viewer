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
            
                let content = readerEvent.target.result;
                let dom = parseXML(content);
                let jsonString = xml2json(dom);
                //let houseObject = JSON.parse(jsonString);
                console.log(jsonString);
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