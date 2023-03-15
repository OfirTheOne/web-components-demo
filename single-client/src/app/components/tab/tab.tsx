
import { WC, Presentable, DefineComponent } from "../../../lib";
import styles from './tab.lazy.scss';

interface TabNavItemProps { 
  id: string; 
  title: string;
  activeTab: string; 
  setActiveTab: (tab: string) => void;
}

@DefineComponent("my-tab-item", { noWrap: true })
export class TabNavItem extends Presentable<TabNavItemProps> {

  buildTemplate({ id, title, activeTab, setActiveTab }) {
    const handleClick = () => {
      setActiveTab(id);
    };

    return (
      <li onClick={handleClick} className={activeTab === id ? `active` : ""}>
        {title}
      </li>
    );
  }
  preRender() {
    console.log('preRender TabNavItem')
  }
}

interface TabContentProps {
  id: string;
  activeTab: string;
}

@DefineComponent("my-tab-content", { noWrap: true })
export class TabContent extends Presentable<TabContentProps> {

  buildTemplate({ id, activeTab }, children) {
    return activeTab === id ? (
      <div className={`TabContent ${id}`}>{children}</div>
    ) : null;
  }
  preRender() {
    console.log('preRender TabContent')
  }
}

interface TabProps {
  tabs: {
    title: string;
    id: string;
    content: JSX.Element;
  }[]
}

@DefineComponent("my-tab")
export class Tab extends Presentable<TabProps> {
  setActiveTab = (tabId: string) => this.setState({ activeTab: tabId });
  
  buildStyle(){
    return styles;
  }
  buildTemplate(props: TabProps) {
    const tabs = props.tabs || []; 
    return (
      <div className={`Tabs`}>
        <ul className={`nav`}>
          {tabs.map((tab) => (
            <TabNavItem
              title={tab.title}
              id={tab.id}
              activeTab={this.state.activeTab}
              setActiveTab={this.setActiveTab}
            />
          ))}
        </ul>
        <div className={`outlet`}>
          {tabs.map((tab) => (
            <TabContent id={tab.id} activeTab={this.state.activeTab}>
              {tab.content}
            </TabContent>
          ))}
        </div>
      </div>
    );
  }

  preRender() {
    console.log('preRender Tab')
  }
}


