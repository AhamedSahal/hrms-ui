import React, { Component } from 'react';
import EmployeeProfilePhoto from '../../../CompanyApp/Employee/widgetEmployeePhoto';
import { getSocialPostReaction } from './service';

export default class ReactionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'All',
      postId: props?.postId || 0,
      reactionList: [],
      likeCount: 0,
      CelebrateCount: 0,
      SupportCount: 0,
      LoveCount: 0,
      InsightfulCount: 0,
      FunnyCount: 0,
    };
  }

  componentDidMount(){
    this.fetchList()
  }

  fetchList = () => {
    getSocialPostReaction(this.props?.postId).then(res => {
        if (res.status == "OK") {
            this.setState({
              reactionList: res.data,
            })
            let like = 0,Celebrate = 0,Support = 0,Love = 0,Insightful = 0,Funny=0;
            (res.data).length > 0 && (res.data).map(data => {
              
              if(data.iconId == 1){
                like = like +1;
              }else if(data.iconId == 2){
                Celebrate = Celebrate +1;
              }else if(data.iconId == 3){
                Support = Support+1;
              }else if(data.iconId == 4){
                Love = Love+1;
              }else if(data.iconId == 5){
                Insightful = Insightful+1;
              }else if(data.iconId == 6){
                Funny = Funny+1;
              }
            })
            this.setState({likeCount: like,
              CelebrateCount:Celebrate,
              SupportCount:Support,
              LoveCount:Love,
              InsightfulCount:Insightful,
              FunnyCount:Funny
            })
        }
    })
}

  handleTabClick = (tabName) => {
    this.setState({ selectedTab: tabName });
  };

  render() {
    const { selectedTab,reactionList } = this.state;

    

    const tabsList = {
      1: "👍 Like",
      2: "👏 Celebrate",
      3: "🤲 Support",
      4: "❤️ Love",
      5: "💡 Insightful",
      6: "😄 Funny",
    };

    const profileImojis = {
      1: "👍",
      2: "👏",
      3: "🤲",
      4: "❤️",
      5: "💡",
      6: "😄",
    };

    // Filter tabsList based on iconId
    const availableTabs = Object.entries(tabsList).filter(([iconId]) =>
      reactionList.some(item => item.iconId === parseInt(iconId))
    );

    const mainTabs = availableTabs.slice(0, 2);
    const moreTabs = availableTabs.slice(2, 6);

    const filteredReactionList = selectedTab === 'All'
      ? reactionList
      : reactionList.filter(item => tabsList[item.iconId] === selectedTab);

    return (
      <div style={{ marginTop: '-20px', minHeight: '28em' }}>
        <div className="row user-tabs">
          <div className="page-headerTab p-0">
            <div className="reactionList p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
              <ul className="nav reaction-items">
                <li className="nav-item">
                  <a
                    data-toggle="tab"
                    className={`nav-link ${selectedTab === 'All' ? 'active' : ''}`}
                    onClick={() => this.handleTabClick('All')}
                  >
                    All <span>({reactionList.length > 0?reactionList.length: 0})</span>
                  </a>
                </li>
                {/* Render the first two tabs */}
                {mainTabs.map(([iconId, label]) => (
                  <li key={iconId} className="nav-item">
                    <a
                      data-toggle="tab"
                      className={`nav-link ${selectedTab === label ? 'active' : ''}`}
                      onClick={() => this.handleTabClick(label)}
                    >
                      {label}<span>({iconId ==1?this.state.likeCount:iconId ==2?this.state.CelebrateCount:iconId ==3?this.state.SupportCount:iconId ==4?this.state.LoveCount:iconId == 5?this.state.InsightfulCount:iconId == 6?this.state.FunnyCount:0 })</span> 
                    </a>
                  </li>
                ))}
                {/* Render the "More" dropdown if there are more tabs */}
                {moreTabs.length > 0 && (
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      data-toggle="dropdown"
                      href="#"
                      role="button"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      More
                    </a>
                    <div className="dropdown-menu">
                      {moreTabs.map(([iconId, label]) => (
                        <a
                          key={iconId}
                          className={`dropdown-item ${selectedTab === label ? 'active' : ''}`}
                          onClick={() => this.handleTabClick(label)}
                          href="#"
                        >
                          {label} <span>({iconId ==1?this.state.likeCount:iconId ==2?this.state.CelebrateCount:iconId ==3?this.state.SupportCount:iconId ==4?this.state.LoveCount:iconId == 5?this.state.InsightfulCount:iconId == 6?this.state.FunnyCount:0 })</span>
                        </a>
                      ))}
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {filteredReactionList.map((item, index) => (
          <div key={index} style={{ marginLeft: '-14px', marginTop: '11px' }}>
            <tr>
              <td>
                <div className='d-flex'>
                <EmployeeProfilePhoto className='createPostProPic' id={item.employee?.id}></EmployeeProfilePhoto>
                  <span style={{
                    position: 'absolute',
                    marginTop: '26px', fontSize: '13px',
                    left: '43px'
                    
                  }}>
                    {profileImojis[item.iconId]}
                  </span>
                  <div className='ml-2 mt-1'>
                    <span style={{ fontWeight: 'bold' }}>{item.employee != null?item.employee?.name:"Admin"}</span> <br />
                    <span>{item.position}</span>
                  </div>
                </div>
              </td>
            </tr>
          </div>
        ))}
      </div>
    );
  }
}
