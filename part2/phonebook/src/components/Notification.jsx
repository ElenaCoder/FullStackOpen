const Notification = ({ message, type }) => {
    if (message === null) {
        return null;
    }

    const notificationStyle = {
        color: type === 'error' ? 'red' : 'green',
        background: 'lightgrey',
        border: `2px solid ${type === 'error' ? 'red' : 'green'}`,
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px',
        fontSize: '16px',
    };

    return <div style={notificationStyle}>{message}</div>;
};

export default Notification;
