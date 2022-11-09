const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    playlist_name:{
        type:String,
        required:true
    },
    movies:[
        {
            movie_id:{
                type:String,
                required:true
            },
            name:{
                type:String,
                required:true    
            },
            poster_link:{
                type:String,
                // required:true  
            }
        }
    ],

    isPrivate:{
        type:Boolean,
        required:true,
        default:false,
    }

}, {
    timestamps: true
});


 // static functions  that can be used from anywhere in the class


const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;