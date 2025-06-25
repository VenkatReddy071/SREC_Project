const express = require('express');
const mongoose = require('mongoose');
const ArticleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,

    },
    image_url: {
        type: String,
        required: true,
        trim: true
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        required: true,
    },
    info: {
        type: String,
        required: true,
        trim: true
    },
    publishedBy: {
        type: String,
        trim: true,
        default: 'Admin'
    },
}, { timestamps: true });

const Article = mongoose.model("Article", ArticleSchema);
module.exports=Article;