import React from 'react';
import { SaveForLater } from './SaveForLater';
import { BookmarkList } from './BookmarkList';
import { BookmarkFilters } from './BookmarkFilters';

export const Sidepanel = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">Reading List</h1>
            <SaveForLater />
            <BookmarkFilters />
            <hr />
            <BookmarkList />
        </div>
    );
};
