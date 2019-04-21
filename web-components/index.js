// Basic custom element declaration
class CustomElement extends HTMLElement {
    connectedCallback() {
        this.innerHTML = '<p>This is a basic custome element</p>';
    }
}
customElements.define('custom-element', CustomElement);

// Basic shadow DOM declaration
const shadowRoot = document.getElementById('shadow-root').attachShadow({mode: 'open'});
const styleNode = document.createElement('style');

// This method doesn't make anything appear on page
// styleNode.innerHTML = `#el-id {
//     color: purple;
//     size: 1.5em;
//     background: cyan;
// }`;
// const pNode = document.createElement('p');
// pNode.innerHTML = "Element with ID: 'el-id' and inside Shadow DOM";
// pNode.id = 'el-id';
// shadowRoot.appendChild(styleNode);

shadowRoot.innerHTML = `<style>
    #el-id {
        color: purple;
        size: 1.5em;
        background: cyan;
    }
</style>
<p id="el-id">Element with ID: 'el-id' and inside Shadow DOM</p>`;

const template = document.getElementById('template-1');
[
    {value: 'books'},
    {value: 'computers'},
    {value: 'excercise'}
].forEach((item, i) => {
    const templateInstance = document.importNode(template.content, true);
    templateInstance.querySelector('.number-output').innerHTML = i + 1;
    templateInstance.querySelector('.value-output').innerHTML = item.value;
    document.getElementById('template-output').appendChild(templateInstance);
})