function Header() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0px', marginLeft:'20px'}}>
            <i
                class="material-icons"
                style={{ color: '#9b9b9b' cursor: 'pointer', marginRight: '20px' }}
                onclick="goHome()"
            >
                home
            </i>
            <i
                id="back"
                className="material-icons"
                style={{color: '#9b9b9b', marginLeft: '-5px', opacity: 0.2 }}
                onclick="goBack()"
            >
                keyboard_arrow_left
            </i>
            <div style="color: #717171; padding: 0px 10px;" id="externalid">
                Label this asset
            </div>
            <i
                id="next"
                className="material-icons"
                style={{color: '#9b9b9b', marginLeft: '-5px', opacity: 0.2 }}
                onclick="goNext()"
            >
                keyboard_arrow_right
            </i>
    </div>
    )
}

export default Header;