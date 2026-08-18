import sqlite from "sqlite3";
import {Image,Vote,User} from "./TableModel.mjs";
import dayjs from "dayjs";
import express, { response } from "express";
import e from "express";
import db from "./data/db.mjs";
"use strict";



const getImage = (id) =>  new Promise((res, rej) => {
    const sql = "SELECT * FROM Image WHERE id=?";

    db.get(sql, [id], (err, row) => {
        if (err)
            rej(err);
        else
            if (!row)
                rej("Image not found");
            else {
                const image = new Image(row.id, row.title, row.url);
                res(image);
            }
        })
    })

// Return images with vote count and whether the given user already voted
const ImageList = (utente_id = null) => new Promise((res, rej) => {
    const sql = `SELECT Image.id, Image.title, Image.url,
        COALESCE((SELECT COUNT(*) FROM Vote v WHERE v.immagine_id = Image.id), 0) AS voti,
        CASE WHEN ? IS NULL THEN 0 ELSE COALESCE((SELECT COUNT(*) FROM Vote v2 WHERE v2.immagine_id = Image.id AND v2.utente_id = ?), 0) END AS voted
    FROM Image`;

    db.all(sql, [utente_id, utente_id], (err, rows) => {
        if (err) return rej(err);
        const images = rows.map((row) => ({ id: row.id, title: row.title, url: row.url, voti: row.voti, voted: !!row.voted }));
        res(images);
    })
})

const storeVote = (utente_id, immagine_id) => new Promise((res, rej) => {
    const sql = "INSERT INTO Vote(utente_id, immagine_id) VALUES(?, ?)";

    db.run(sql, [utente_id, immagine_id], function (err) {
        if (err)
            rej(err);
        else
            res(this.lastID);
    })
})

const incrementVoteCount = (immagine_id) => new Promise((res, rej) => {
    const sql = "UPDATE Image SET vote = vote + 1 WHERE id=?";

    db.run(sql, [immagine_id], function (err) {
        if (err)
            rej(err);
        else
            res(this.changes);
    })
})

const getUserByEmail = (email) => new Promise((res, rej) => {
    const sql = "SELECT * FROM User WHERE email=?";

    db.get(sql, [email], (err, row) => {
        if (err)
            rej(err);
        else
            if (!row)
                res(null);
            else {
                const user = new User(row.id, row.name, row.surname, row.email);
                res(user);
            }
    })
})

const createUser = (user) => new Promise((res, rej) => {
    const sql = "INSERT INTO User(name, surname, email) VALUES(?, ?, ?)";

    db.run(sql, [user.name, user.surname, user.email], function (err) {
        if (err)
            rej(err);
        else
            res(new User(this.lastID, user.name, user.surname, user.email));
    })
})

const getUserVoteCount = (utente_id) => new Promise((res, rej) => {
    const sql = "SELECT COUNT(*) as count FROM Vote WHERE utente_id = ?";

    db.get(sql, [utente_id], (err, row) => {
        if (err)
            rej(err);
        else
            res(row?.count || 0);
    })
})

const canUserVote = (utente_id) => new Promise((res, rej) => {
    getUserVoteCount(utente_id)
        .then(count => {
            res(count < 3);
        })
        .catch(err => rej(err));
})

const hasUserVoted = (utente_id, immagine_id) => new Promise((res, rej) => {
    const sql = "SELECT COUNT(*) as count FROM Vote WHERE utente_id = ? AND immagine_id = ?";

    db.get(sql, [utente_id, immagine_id], (err, row) => {
        if (err)
            rej(err);
        else
            res(row?.count > 0);
    })
})

const removeVote = (utente_id, immagine_id) => new Promise((res, rej) => {
    const sql = "DELETE FROM Vote WHERE utente_id = ? AND immagine_id = ?";

    db.run(sql, [utente_id, immagine_id], function (err) {
        if (err)
            rej(err);
        else
            res(this.changes);
    })
})

const decrementVoteCount = (immagine_id) => new Promise((res, rej) => {
    const sql = "UPDATE Image SET vote = vote - 1 WHERE id=? AND vote > 0";

    db.run(sql, [immagine_id], function (err) {
        if (err)
            rej(err);
        else
            res(this.changes);
    })
})

export { ImageList, storeVote, incrementVoteCount, getUserByEmail, createUser, getUserVoteCount, canUserVote, hasUserVoted, removeVote, decrementVoteCount };