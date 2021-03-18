import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red, green, yellow, orange } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import { Edit, Lock, LockOpen } from '@material-ui/icons';
import { useSwipeable } from "react-swipeable";
import img from './../static/images/meusli.jpg'


const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
        height: 260,
        borderRadius: 16
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
        backgroundColor: green[500],
    },
}));

export function MealCard({ mealOptions, viewMealDetailsHanlder }) {
    const swipeConfig = {
        delta: 10,                            // min distance(px) before a swipe starts
        preventDefaultTouchmoveEvent: false,  // call e.preventDefault *See Details*
        trackTouch: true,                     // track touch input
        trackMouse: false,                    // track mouse input
        rotationAngle: 0,                     // set a rotation angle
    }
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
    }

    const handleLoveClick = () => {
        console.debug("Love not implemented!");
    }

    const handleShareClick = () => {
        console.debug("Share not implemented!");
    }

    const swipeHandlers = useSwipeable({
        onSwipedLeft: (e) => viewPreviousOption(e),
        onSwipedRight: (e) => viewNextOption(e),
        ...swipeConfig,
    });

    const viewNextOption = (e) => {
        console.debug("Right swipe", e);
        let newIdx = mealOptionIdx + 1;

        if (newIdx >= mealOptions.length) {
            newIdx = 0;
        }
        setMealOptionIdx(newIdx);
        setVisibleMealOption(mealsList[newIdx]);
    };


    const viewPreviousOption = (e) => {
        console.debug("Left swipe", e);
        let newIdx = mealOptionIdx - 1;

        if (newIdx < 0) {
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
        <>
            <Card variant="outlined" raised={true} {...swipeHandlers} className={classes.root}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="recipe" className={classes.avatar}>
                            {visibleMealOption ? (visibleMealOption.calories ? visibleMealOption.calories : 0) : 0}
                        </Avatar>
                    }
                    title={visibleMealOption ? visibleMealOption.name : ""}
                    subheader={visibleMealOption ? visibleMealOption.category : ""}
                />
                <CardMedia
                    onClick={handleEditClick}
                    className={classes.media}
                    title="Paella dish"
                    image={visibleMealOption ? (visibleMealOption.thumbnailURL ? visibleMealOption.thumbnailURL : img) : img}
                />
                <CardContent onClick={handleEditClick}>
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
                        aria-label="lock meal option">
                        {locked ? <Lock /> : <LockOpen />}
                    </IconButton>
                </CardActions>
            </Card>
        </>
    );
}