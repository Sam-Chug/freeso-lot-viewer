importUtils = function() {

    function importXMLFile() {

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
                
                // XML string from file
                let content = readerEvent.target.result;

                // Convert XML to json, send to lot object
                let x2js = new X2JS();
                lotDataHolder = new LotObject(x2js.xml_str2json(content));
            }
        }
    }

    return {
        importXMLFile: importXMLFile
    }
}();

houseUtils = function() {

    return {
        
    }
}();

loadUtils = function() {

    async function loadImages(imageUrls) {

        const promiseArray = [];
        const imageArray = [];
    
        for (let url of imageUrls) {
    
            promiseArray.push(new Promise(resolve => {
    
                const img = new Image();
                img.onload = function() {
    
                    resolve();
                }
                img.src = url;
                imageArray.push(img);
            }));
        }
        await Promise.all(promiseArray);
        return imageArray;
    }
    
    async function loadAllImages() {
    
        let floorImages = await loadImages(HOUSE_SPRITES);
        SPRITESHEET_FLOOR = floorImages[0];
    }
    
    return {
        loadAllImages: loadAllImages
    }
}();