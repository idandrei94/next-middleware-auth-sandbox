import { connect } from "http2";
import mongoose from "mongoose";

declare global
{
    var mongoose: { conn: mongoose, promise: Promise<mongoose> | null; };
}