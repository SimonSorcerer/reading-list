import React from 'react';
import { SaveForLater } from './SaveForLater';
import { BookmarkList } from './BookmarkList';

export const Sidepanel = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">Reading List</h1>
            <SaveForLater />
            <hr />
            <BookmarkList />
        </div>
    );
};
