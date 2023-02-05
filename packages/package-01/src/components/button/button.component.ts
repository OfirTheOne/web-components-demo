
(async () => {
    const {
        BaseWebComponent,
        attachShadowDom,
        defineComponent,
        parseHTML, 
        withContainer
    } = await import(/* webpackPrefetch: true */ 'shared/utils' );
     
    
    defineComponent('my-button',
        class MyButton extends BaseWebComponent {
            constructor() {
                super();
                withContainer(this.container)`
                    <button class="count"> My Button </button>
                `;
            }
        }
    );

})();
export { }
