import React from 'react';
import config from '../config';
import './EditBookmark.css';
import BookmarksContext from '../BookmarksContext';

export default class EditBookmark extends React.Component {
    static contextType = BookmarksContext;

    state = { 
        error: null,
        title: '',
        url: '',
        description: '',
        rating: ''
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        fetch(config.API_ENDPOINT + `/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${config.API_KEY}`
            }
        })
        .then(res => {
            if (!res.ok) {
              throw new Error(res.status)
            }
            return res.json()
        })
        .then(res => {
            this.setState({
                title: res.title,
                url: res.url,
                description: res.description,
                rating: res.rating,
            });
        })
        .catch(error => this.setState({ error }))
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { title, url, description, rating } = e.target;
        const bookmark = {
            title: title.value,
            url: url.value,
            description: description.value,
            rating: rating.value,
        };
        this.setState({ error: null });
        const id = this.props.match.params.id;
        fetch(config.API_ENDPOINT + `/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(bookmark),
            headers: {
                'content-type': 'application/json',
                'authorization': `bearer ${config.API_KEY}`,
            }
        })
        .then(res => {
            if (!res.ok) {
              return res.json().then(error => {
                throw error
              })
            }
            return res;
        })
        .then(res => {
            this.context.editBookmark({
                id: id,
                ...bookmark
            });
            title.value = '';
            url.value = '';
            description.value = '';
            rating.value = '';
            this.props.history.push('/');
        })
        .catch(error => {
            this.setState({ error });
        });
    }

    handleChangeTitle = (event) => {
        this.setState({ 'title': event.target.value })
    };

    handleChangeURL = (event) => {
        this.setState({ 'url': event.target.value })
    };

    handleChangeDescription = (event) => {
        this.setState({ 'description': event.target.value })
    };

    handleChangeRating = (event) => {
        this.setState({ 'rating': event.target.value })
    };

    handleClickCancel = () => {
        this.props.history.push('/');
    };

    render() {
        const { error, title, url, description, rating } = this.state;
        return (
            <section className='EditBookmark'>
                <h2>Edit Bookmark</h2>
                <form
                    className='EditBookmark__form'
                    onSubmit={this.handleSubmit}
                >
                    <div className='EditBookmark__error' role='alert'>
                        {error && <p>{error.message}</p>}
                    </div>
                    <div>
                        <label htmlFor='title'>
                            Title
                        </label>
                        <input
                            type='text'
                            name='title'
                            id='title'
                            value={title}
                            onChange={this.handleChangeTitle}
                        />
                    </div>
                    <div>
                        <label htmlFor='url'>
                            URL
                        </label>
                        <input
                            type='url'
                            name='url'
                            id='url'
                            value={url}
                            onChange={this.handleChangeURL}
                        />
                    </div>
                    <div>
                        <label htmlFor='description'>
                            Description
                        </label>
                        <input
                            type='text'
                            name='description'
                            id='description'
                            value={description}
                            onChange={this.handleChangeDescription}
                        />
                    </div>
                    <div>
                        <label htmlFor='rating'>
                            Rating
                        </label>
                        <input
                            type='number'
                            name='rating'
                            id='rating'
                            min='1'
                            max='5'
                            value={rating}
                            onChange={this.handleChangeRating}
                        />
                    </div>
                    <div className='EditBookmark__buttons'>
                        <button 
                            type='button'
                            onClick={this.handleClickCancel}
                        >
                            Cancel
                        </button>
                        {' '}
                        <button type='submit'>
                            Edit
                        </button>
                    </div>
                </form>
            </section>



        );
    }
}