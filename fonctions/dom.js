/**
 * 
 * @param {string} tagName 
 * @param {object} attribut 
 * @returns {HTMLElement}
 */
export function createEle(tagName,attributes ={}){
    const element = document.createElement(tagName);
    // Add attributes to the element if provided in the attributes object
    for (const [attribute,value] of Object.entries(attributes)) {
        if(value !== null){
            element.setAttribute(attribute,value);
        }
    }
    return element;
}