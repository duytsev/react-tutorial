var my_news = [{
    author: 'Sam D.',
    text: 'Hello, my name is Sam',
    bigText: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
}, {
    author: 'Bob Green',
    text: 'Lorem ipsum',
    bigText: 'Contrary to popular belief, Lorem Ipsum is not simply random text. '
}];

window.ee = new EventEmitter();

var News = React.createClass({	propTypes: {
    	data: React.PropTypes.array.isRequired
    },

    getInitialState: function() {
	    return {
	      counter: 0
	    };
    },

    render: function() {
        var data = this.props.data;

        var newsTemplate;
        if (data.length > 0) {
            newsTemplate = data.map(function(item, index) {
                return (
		            <div key={data.length - index}>
		            	<Article data={item} />
		            </div>
                );
            })
        } else {
            newsTemplate = <p>К сожалению новостей нет</p>
        }

        return (
	        <div className="news">
		        {newsTemplate}
		        <strong className={'news__count ' + (data.length > 0 ? '':'none') }>
		        	Всего новостей: {data.length} 
		        </strong>
	        </div>
        );
    }
});


var Article = React.createClass({
	propTypes: {
	    data: React.PropTypes.shape({
	      author: React.PropTypes.string.isRequired,
	      text: React.PropTypes.string.isRequired,
	      bigText: React.PropTypes.string.isRequired
	    })
    },

    getInitialState: function() {
	    return {
	      visible: false
	    };
    },

    readmoreClick: function(e) {
	    e.preventDefault();
	    this.setState({visible: true});
  	},

    render: function() {
        var item = this.props.data,
        	visible = this.state.visible;
        return (
	        <div className="article">
		        <p className="news__author">{item.author}:</p>
		        <p className="news__text">{item.text}</p>
		        <a href="#" onClick={this.readmoreClick} 
		        	className={'news__readmore ' + (visible ? 'none' : '')}>
		        		Подробнее
	        	</a>
		        <p className={'news__big-text ' + (visible ? '' : 'none')}>{item.bigText}</p>
	        </div>
        );
    }
});

var Add = React.createClass({

  getInitialState: function() { 
    return {
      agreeNotChecked: true,
      authorIsEmpty: true,
      textIsEmpty: true
    };
  },

  componentDidMount: function() {
    ReactDOM.findDOMNode(this.refs.author).focus();
  },		

  onBtnClickHandler: function(e) {
	e.preventDefault();
    var author = ReactDOM.findDOMNode(this.refs.author).value;
    var textEl = ReactDOM.findDOMNode(this.refs.text);
    var text = textEl.value;
    var item = [{
        author: author,
        text: text,
        bigText: '...'
    }];

    window.ee.emit('News.add', item);

    textEl.value = '';
    this.setState({textIsEmpty:true});
  },

  onCheckRuleClick: function(e) {
    this.setState({agreeNotChecked: !this.state.agreeNotChecked}); 
  },

  onAuthorChange: function(e) {
      if (e.target.value.trim().length > 0) {
        this.setState({authorIsEmpty: false});
      } else {
        this.setState({authorIsEmpty: true});
      }
  },

  onTextChange: function(e) {
      if (e.target.value.trim().length > 0) {
        this.setState({textIsEmpty: false});
      } else {
        this.setState({textIsEmpty: true});
      }
  },

  onFieldChange: function(fieldName, e) {
    this.setState({[fieldName]: !e.target.value.trim().length});
  },

  render: function() {
    return (
      <form className='add cf'>
        <input
          type='text'
          className='add__author'
          defaultValue=''
          placeholder='Ваше имя'
          ref='author'
          onChange={this.onFieldChange.bind(this, 'authorIsEmpty')}/>
        <textarea
          className='add__text'
          defaultValue=''
          placeholder='Текст новости'
          ref='text' onChange={this.onFieldChange.bind(this, 'textIsEmpty')}/>
        <label className='add__checkrule'>
          <input type='checkbox' defaultChecked={false} ref='checkrule' onChange={this.onCheckRuleClick}/>
            Я согласен с правилами
        </label>
        <button
          className='add__btn'
          onClick={this.onBtnClickHandler}
          ref='alert_button' 
          disabled={this.state.agreeNotChecked || this.state.authorIsEmpty || this.state.textIsEmpty}>
            Добавить новость
        </button>
      </form>
    );
  }
});


var App = React.createClass({
    getInitialState: function() {
        return {
          news: my_news
        };
    },
    componentDidMount: function() {
        var self = this;
        window.ee.addListener('News.add', function(item) {
            var nextNews = item.concat(self.state.news);
            self.setState({news: nextNews});
        });
    },
    componentWillUnmount: function() {
        window.ee.removeListener('News.add');
    },
    render: function() {
        return (
	        <div className="app">
	        	<Add />
		        <h3>Новости</h3> 
		        <News data={this.state.news} />
	        </div>
        );
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('root')
);