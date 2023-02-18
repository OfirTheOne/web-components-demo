

(async () => {
  const [
    {
      defineComponent,
      withContainer
    }, {
      BaseWebComponent
    }
  ] = await Promise.all([
    import( /* webpackPrefetch: true */ 'shared/utils'),
    import( /* webpackPrefetch: true */ 'shared/core')
  ]);



  defineComponent('my-nav-bar',
    class NavBar extends BaseWebComponent {
      buildStyle(): string {
        return '';
      }
      buildTemplate(): string | HTMLElement {
        return document.createElement('div');
      }


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
