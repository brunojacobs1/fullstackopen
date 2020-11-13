import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import Blog from './BlogList';
import BlogForm from './BlogForm';

test('Blog component should render the title but not its url or number of likes by default', () => {
    const blog = {
        title: 'test title',
        url: 'www.test.com',
        likes: 0
    }

    const component = render(<Blog blog={blog} />)
    const div = component.container.querySelector('.blog')
    expect(div).toHaveTextContent('test title')
    expect(div).not.toHaveTextContent('www.test.com')
    expect(div).not.toHaveTextContent('likes')
})

test('should render the url and likes when the button is clicked', () => {
    const blog = {
        title: 'test title',
        url: 'www.test.com',
        likes: 0,
        user: 'not me'
    }
    const user = {
        name: 'me'
    }

    const component = render(<Blog blog={blog} user={user} />)
    const button = component.getByText('view')
    fireEvent.click(button)
    const div = component.container.querySelector('.togglableContent')
    expect(div).toHaveTextContent('www.test.com')
    expect(div).toHaveTextContent('likes')
})

test('should call event handler twice if the like button is clicked twice', () => {
    const blog = {
        title: 'test title',
        url: 'www.test.com',
        likes: 0,
        user: 'not me'
    }
    const user = {
        name: 'me'
    }

    const mockHandler = jest.fn()

    const component = render(
        <Blog blog={blog} user={user} updateBlog={mockHandler} />
    )

    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)

    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
})

test('Blog form calls the event handler with the right details when a new blog is created', () => {
    const addBlog = jest.fn()

    const component = render(
        <BlogForm createBlog={addBlog} />
    )
    const form = component.container.querySelector('.form')

    const author = component.container.querySelector('#author')
    const title = component.container.querySelector('#title')
    const url = component.container.querySelector('#url')

    fireEvent.change(author, {
        target: { value: 'me lol' }
    })
    fireEvent.change(title, {
        target: { value: 'test title' }
    })
    fireEvent.change(url, {
        target: { value: 'test url' }
    })

    fireEvent.submit(form)
    expect(addBlog.mock.calls[0][0].title).toBe('test title')
    expect(addBlog.mock.calls[0][0].author).toBe('me lol')
    expect(addBlog.mock.calls[0][0].url).toBe('test url')
})
