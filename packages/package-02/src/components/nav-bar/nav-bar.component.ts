

(async () => {
    const {
        BaseWebComponent,
        defineComponent,
        withContainer
    } = await import( /* webpackPrefetch: true */ 'shared/utils');
      
    
defineComponent('my-nav-bar',
  class NavBar extends BaseWebComponent {
    constructor() {
      super();

      this.container.classList.add('nav-bar-container');
      this.styleElement.textContent = `
        .nav-bar-container nav-bar  {
          display: flex;
        }

        .nav-bar-container nav-bar div {
          display: flex;
        }
      `;

      withContainer(this.container)`
        <nav-bar> 
          <div> A </div>
          <div> B </div>
          <div> C </div>
        </nav-bar>
      `;
    }
  }
);

})();

export { }
