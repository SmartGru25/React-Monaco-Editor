import React from 'react'

class MonacoEditor extends React.Component {
  static defaultProps = {
    width: '100%',
    height: 500,
    value: '',
    language: 'javascript',
    theme: 'vs-dark',
  };
  componentDidMount() {
    this.afterViewInit();
  }
  componentWillUnmount() {
    this.destroyMonaco();
  }
  afterViewInit() {
    var onGotAmdLoader = () => {
      // Load monaco
      window.require(['vs/editor/editor.main'], () => {
        this.initMonaco();
      });
    };

    // Load AMD loader if necessary
    if (typeof window.require === 'undefined') {
      var loaderScript = document.createElement('script');
      loaderScript.type = 'text/javascript';
      loaderScript.src = 'vs/loader.js';
      loaderScript.addEventListener('load', onGotAmdLoader);
      document.body.appendChild(loaderScript);
    } else {
      onGotAmdLoader();
    }
  }
  // Register listeners
  registerListeners(listeners) {
    for (let listener in listeners) {
      if (this.editor[listener]) {
        this.editor[listener]((e) => {
          if (this.props.listeners[listener]) {
            this.props.listeners[listener](e);
          }
        });
      }
    }
  }
  initMonaco() {
    const { value, language, options, onDidMount } = this.props;
    const containerElement = this.refs.container;
    if (typeof monaco !== 'undefined') {
      this.editor = monaco.editor.create(containerElement, {
        value,
        language,
        ...options,
      });
      //this.registerListeners(listeners);
      // After monaco editor has been initialized
      if (onDidMount) {
        onDidMount(this.editor);
      }
    }
  }
  destroyMonaco() {
    if (typeof this.editor !== 'undefined') {
      this.editor.dispose();
    }
  }
  render() {
    const { width, height } = this.props;
    return (
      <div ref="container" style={{ width, height }} className="react-monaco-editor-container"></div>
    )
  }
}

export default MonacoEditor;
