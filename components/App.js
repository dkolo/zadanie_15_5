App = React.createClass({
    getInitialState() {
        return {
            loading: false,
            searchingText: '',
            gif: {}
        };
    },

    getGif: function (searchingText) {
        return new Promise(
            function (resolve, reject) {
                const GIPHY_API_URL = 'https://api.giphy.com';
                let url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + 'AeMRGJvfOzX10nFqx1B7OdB9vUYxOZ7W' + '&tag=' + searchingText;
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url);
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        const data = JSON.parse(xhr.responseText).data;
                        let gif = {
                            url: data.fixed_width_downsampled_url,
                            sourceUrl: data.url
                        };
                        resolve(gif);
                    } else {
                        reject(new Error(this.statusText));
                    }
                };
                xhr.onerror = function () {
                    reject(new Error(
                        `XMLHttpRequest Error: ${this.statusText}`
                    ));
                };
                xhr.send();
            })
    },

    handleSearch: function (searchingText) {
        this.setState({
            loading: true
        });
        this.getGif(searchingText)
            .then(gif => {
                this.setState({
                    loading: false,
                    gif: gif,
                    searchingText: searchingText
                });
            })
            .catch(error => {
                console.log('Something went wrong ', error);
            });
    },

    render: function () {

        var styles = {
            margin: '0 auto',
            textAlign: 'center',
            width: '90%'
        };

        return (
            <div style={styles}>
                <h1>Wyszukiwarka GIFow!</h1>
                <p>Znajdź gifa na <a href='http://giphy.com'>giphy</a>. Naciskaj enter, aby pobrać kolejne gify.</p>
                <Search
                    onSearch={this.handleSearch}
                />
                <Gif
                    loading={this.state.loading}
                    url={this.state.gif.url}
                    sourceUrl={this.state.gif.sourceUrl}
                />
            </div>
        );
    }
});