// @ts-nocheck

import { WC, createElement, createFragment } from "shared/jsx";
import { Presentable } from "shared/core";
import { DefineComponent } from "shared/decorators";



@DefineComponent('my-tab-item', { noWrap: true })
export class TabNavItem extends Presentable {

  buildStyle(): string {
    return ``;
  }

  buildTemplate({ id, title, activeTab, setActiveTab }) {

    const handleClick = () => {
      setActiveTab(id);
    };

    return (
      <li onClick={handleClick} className={activeTab === id ? "active" : ""}>
        {title}
      </li>
    );
  }
}

@DefineComponent('my-tab-content')
export class TabContent extends Presentable {

  buildStyle(): string {
    return `
    .TabContent {
      font-size: 2rem;
      text-align: center;
    }
    
     `;
  }
  buildTemplate({ id, activeTab }, children) {
    return (
      activeTab === id ? <div className={`TabContent ${id}`}>
        {children}
      </div>
        : null
    );
  }
}

@DefineComponent('my-tab')
export class Tab extends Presentable {

  setActiveTab = (tabId: string) => this.setState({ activeTab: tabId });

  buildStyle(): string {
    return `
    .Tabs {
      width: 80%;
      height: auto;
      min-height: 400px;
      background: #053742;
      margin: 3.5rem auto 1.5rem;
      padding: 2rem 1rem;
      color: #E8F0F2;
      border-radius: 2rem;
      @media (max-width: 769px) {
        padding: 2rem 0;
      }
     
    }
     
    /* Tab Navigation */
    ul.nav {
      width: 60%;
      margin: 0 auto 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid #39A2DB;
      border-radius: 2rem;
      padding-left: 0px;
      @media (max-width: 768px) {
        width: 90%;
      }
    }
     
    ul.nav li {
      width: 50%;
      padding: 1rem;
      list-style: none;
      text-align: center;
      cursor: pointer;
      transition: all 0.7s;
    }
     
    ul.nav li:first-child {
      border-bottom-left-radius: 2rem;
      border-top-left-radius: 2rem;
    }
     
    ul.nav li:last-child {
      border-bottom-right-radius: 2rem;
      border-top-right-radius: 2rem;
    }
     
    ul.nav li:hover {
      background: rgba(50, 224, 196, 0.15);
    }
     
    ul.nav li.active {
      background: #39A2DB;
    }
      `;
  }
  buildTemplate({ incCounter }) {

    return (
      <div className="Tabs">
        <ul className="nav">
          <TabNavItem title="Tab 1" id="tab1" activeTab={this.state.activeTab} setActiveTab={this.setActiveTab} />
          <TabNavItem title="Tab 2" id="tab2" activeTab={this.state.activeTab} setActiveTab={this.setActiveTab} />
          <TabNavItem title="Tab 3" id="tab3" activeTab={this.state.activeTab} setActiveTab={this.setActiveTab} />
        </ul>
        <div className="outlet" onClick={incCounter}>
            <TabContent id="tab1" activeTab={this.state.activeTab}>
              <p>Tab 1 works!</p> 
            </TabContent>
            <TabContent id="tab2" activeTab={this.state.activeTab}>
              <p>Tab 2 works!</p> 
            </TabContent>
            <TabContent id="tab3" activeTab={this.state.activeTab}>
              <p>Tab 3 works!</p> 
            </TabContent>
        </div>
      </div>
    );
  };
}
