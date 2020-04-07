/**
 * Members Bulk Delete
 *
 * Usage:
 *
 * node members-bulk-delete.js https://blah.ghost.io ADMIN_API_KEY
 */

if (process.argv.length < 4) {
    console.error('Missing an argument');
    process.exit(1);
}

const url = process.argv[2];
const key = process.argv[3];

const Promise = require('bluebird');
const GhostAdminAPI = require('@tryghost/admin-api');
const api = new GhostAdminAPI({
    url,
    key,
    version: 'canary'
});

(async function main() {
    try {
        const allMembers = await api.members.browse({limit: '3'});
        const deletePromises = [];

        allMembers.forEach((member) => {
            // Comped members should have a subscription, but just in case
            if (member.comped || member.stripe.subscriptions.length === 0) {
                deletePromises.push(api.members.delete({id: member.id}));
            }
        });

        await Promise
            .all(deletePromises);
    } catch (err) {
        console.error('There was an error', require('util').inspect(err, false, null));
        process.exit(1);
    }
}());