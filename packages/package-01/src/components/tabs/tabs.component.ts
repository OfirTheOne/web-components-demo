

import { 
    BaseWebComponent,
    defineComponent,
} from 'shared/utils';

const MyTabsCSS = `
.container--tabs {
    margin: 2rem;

    .nav-tabs {
        float: left;
        width: 100%;
        margin: 0;
        list-style-type: none;
        border-bottom: 1px solid #ddd;

        > li {
            float: left;
            margin-bottom: -1px;

            > a {
                float: left;
                margin-right: 2px;
                line-height: 1.42857143;
                padding: 10px;
                border: 1px solid transparent;
                border-radius: 4px 4px 0 0;

                &:hover {
                    border-color: #eee #eee #ddd;
                }
            }

            &.active {
                > a,
                > a:hover,
                > a:focus {
                    color: #555;
                    cursor: default;
                    background-color: #fff;
                    border: 1px solid #ddd;
                    border-bottom-color: transparent;
                }
            }
        }
    }

    .tab-content {
        float: left;
        width: 100%;

        > .tab-pane {
            display: none;

            &.active {
                display: block;
                padding: 2.5% 3.5%;
                background-color: #efefef;
            }
        }

        > .active {
            display: block;
        }
    }

}
`;

defineComponent('tabs',
    class MyTabs extends BaseWebComponent {
        buildStyle(): string {
            return '';
        }
        buildTemplate(): string | HTMLElement | JSX.Element {
            return document.createElement('input');
        }
        constructor() {
            super();
            this.classCollection.add("my-input");
            this.styleElement.textContent = MyTabsCSS;

            `
        <div class="container--tabs">
            <section class="row">
                <ul class="nav nav-tabs">
                    <li class="active"><a href="#tab-1">Tab 1</a></li>
                    <li class=""><a href="#tab-2">Tab 2</a></li>
                    <li class=""><a href="#tab-3">Tab 3</a></li>
                </ul>
                <div class="tab-content">
                    <div id="tab-1" class="tab-pane active"> 
                        <span class="glyphicon glyphicon-leaf glyphicon--home--feature two columns text-center"></span>
                        <span class="col-md-10">
                            <h3>Feature 1</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                        </span>
                    </div> 
                    <div id="tab-2" class="tab-pane">
                        <span class="glyphicon glyphicon-fire glyphicon--home--feature two columns text-center"></span>
                        <span class="col-md-10">
                            <h3>Feature 2</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                        </span>
                    </div>
                    <div id="tab-3" class="tab-pane">
                        <span class="glyphicon glyphicon-tint glyphicon--home--feature two columns text-center"></span>
                        <span class="col-md-10">
                            <h3>Feature 3</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                        </span>
                    </div>
                </div>
            </section>
        </div>    
            `
        }
    }
);


defineComponent('tab-item',
    class TabItem extends BaseWebComponent {
        buildStyle(): string {
            return '';
        }
        buildTemplate(): string | HTMLElement{
            return document.createElement('input');
        }

        public tabId: string;
        public displayTitle: string;
        public order: number;

        constructor() {
            super();
            this.container.classList.add("div");
            const children = this.childNodes;
            this.container.append(...children);
            children.forEach(node => this.removeChild(node));
            this.styleElement.textContent = MyTabsCSS;

            `
        <div class="container--tabs">
            <section class="row">
                <ul class="nav nav-tabs">
                    <li class="active"><a href="#tab-1">Tab 1</a></li>
                    <li class=""><a href="#tab-2">Tab 2</a></li>
                    <li class=""><a href="#tab-3">Tab 3</a></li>
                </ul>
                <div class="tab-content">
                    <div id="tab-1" class="tab-pane active"> 
                        <span class="glyphicon glyphicon-leaf glyphicon--home--feature two columns text-center"></span>
                        <span class="col-md-10">
                            <h3>Feature 1</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                        </span>
                    </div> 
                    <div id="tab-2" class="tab-pane">
                        <span class="glyphicon glyphicon-fire glyphicon--home--feature two columns text-center"></span>
                        <span class="col-md-10">
                            <h3>Feature 2</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                        </span>
                    </div>
                    <div id="tab-3" class="tab-pane">
                        <span class="glyphicon glyphicon-tint glyphicon--home--feature two columns text-center"></span>
                        <span class="col-md-10">
                            <h3>Feature 3</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                        </span>
                    </div>
                </div>
            </section>
        </div>    
            `
        }
    }
);

