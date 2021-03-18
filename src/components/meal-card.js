import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import EditIcon from '@material-ui/icons/Edit';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Edit, Lock, LockOpen } from '@material-ui/icons';
import img from './../static/images/meusli.jpg'

const lorem = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
        height: 250
    },
    media: {
        height: 0,
        paddingTop: '15%'//'56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        fontSize: "0.8rem",
        backgroundColor: red[500],
    },
}));

export function MealCard({ mealOptions, viewMealDetailsHanlder }) {
    const classes = useStyles();
    const [locked, setLocked] = useState(false);
    const [mealsList, setMealOptionsList] = useState(mealOptions ? mealOptions : []);
    const [mealOptionIdx, setMealOptionIdx] = useState(0);
    const [visibleMealOption, setVisibleMealOption] = useState();

    const handleLockClick = () => {
        setLocked(!locked);
        console.debug(`Lock ${locked ? "released" : "applied"}!`);
    };

    const handleEditClick = () => {
        viewMealDetailsHanlder(visibleMealOption);
        console.debug("Edit not implemented!");
    }

    const handleLoveClick = () => {
        console.debug("Love not implemented!");
    }

    const handleShareClick = () => {
        console.debug("Share not implemented!");
    }

    const viewNextOption = () => {
        let newIdx = mealOptionIdx + 1;

        if (newIdx >= mealOptions.length) {
            newIdx = 0;
        }
        setMealOptionIdx(newIdx);
        setVisibleMealOption(mealsList[newIdx]);
    };

    const truncateLongText = ({ text, maxLength = 90, noofEllipses = 3 }) => {
        if (text?.length >= (maxLength - noofEllipses)) {
            return text.substring(0, (maxLength - noofEllipses)) + ".".repeat(noofEllipses);
        }
        return text;
    }

    useEffect(() => {
        if (mealOptions) {
            setVisibleMealOption(mealOptions[0]);
            setMealOptionsList(mealOptions);
        }
    }, [mealOptions]);   // Reload card if mealOptions change

    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        {visibleMealOption ? visibleMealOption.calories : 0}
                    </Avatar>
                }
                action={
                    <IconButton onClick={handleEditClick} aria-label="edit">
                        <Edit />
                    </IconButton>
                }
                title={visibleMealOption ? visibleMealOption.name : ""}
                subheader={visibleMealOption ? visibleMealOption.category : ""}
            />
            <CardMedia
                className={classes.media}
                title="Paella dish"
                image={img}
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {visibleMealOption ? truncateLongText({ text: visibleMealOption.description }) : ""}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton onClick={handleLoveClick} aria-label="add to favorites">
                    <FavoriteIcon />
                </IconButton>
                <IconButton onClick={handleShareClick} aria-label="share">
                    <ShareIcon />
                </IconButton>
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: locked,
                    })}
                    onClick={handleLockClick}
                    aria-expanded={locked}
                    aria-label="lock meal option"
                >
                    {locked ? <Lock /> : <LockOpen />}
                </IconButton>
            </CardActions>
        </Card>
    );
}