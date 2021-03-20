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
import { red, green, yellow, orange, purple } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import { Edit, Lock, LockOpen } from '@material-ui/icons';
import { useSwipeable } from "react-swipeable";
import img from './../static/images/meusli.jpg'
import './meal-card.css';
import { Box } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
        height: "15rem",
        borderRadius: 16,
        display: "grid",
        gridTemplateRows: "auto 1fr auto"
    },
    media: {
        borderRadius: "50%",
        marginRight: 3,
        height: 0,
        paddingTop: '100%'//'56.25%', // 16:9
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
        fontSize: "0.8rem"
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
    const [calorieColor, setCalorieColor] = useState(purple[500])

    const handleLockClick = () => {
        setLocked(!locked);
        console.debug(`Lock ${locked ? "released" : "applied"}!`);
    };

    const getCalorieColor = (meal) => {

        const calorieValue = meal?.calories ?? 0;
        if (calorieValue < 250) {
            setCalorieColor(green[600]);
            return;
        }

        if (calorieValue > 250 && calorieValue <= 350) {
            setCalorieColor(yellow[600]);
            return;
        }

        if (calorieValue > 350 && calorieValue <= 500) {
            setCalorieColor(orange[600]);

            return;
        }
        setCalorieColor(red[500]);
    }


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
        onSwipedLeft: (e) => handleLeftSwipe(e),
        onSwipedRight: (_) => handleRightSwipe(),
        ...swipeConfig,
    });

    const handleRightSwipe = () => {
        if(!locked){
            setLocked(true);
            alert(`Its confirmed, we are having ${visibleMealOption?.name} for ${visibleMealOption?.category}!`);
        }
    };


    const handleLeftSwipe = (e) => {
        if(locked){
            console.warn("Lock applied, release lock to continue browsing");
            return;
        }
        const newIdx = (mealOptionIdx + 1) >= mealOptions.length ? 0 : mealOptionIdx + 1;
        console.debug("Swipe left, dismiss!", "New Idx", newIdx);
        setMealOptionIdx(newIdx);
        setVisibleMealOption(mealsList[newIdx]);
        getCalorieColor(mealsList[newIdx]);
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
            getCalorieColor(mealOptions[0]);
        }
    }, [mealOptions]);   // Reload card if mealOptions change

    return (

        <Card variant="outlined" raised={true} {...swipeHandlers} className={classes.root}>
            <CardHeader
                className="card-header"
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar} style={{ backgroundColor: calorieColor }}>
                        {visibleMealOption ? (visibleMealOption.calories ? visibleMealOption.calories : 0) : 0}
                    </Avatar>
                }
                title={visibleMealOption ? truncateLongText({ text: visibleMealOption.name, maxLength: 30 }) : ""}
                subheader={visibleMealOption ? visibleMealOption.category : ""}
            />

            <section className="card-body">
                <CardContent onClick={handleEditClick}>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {visibleMealOption ? truncateLongText({ text: visibleMealOption.description }) : ""}
                    </Typography>
                </CardContent>
                <CardMedia
                    onClick={handleEditClick}
                    className={classes.media}
                    title={visibleMealOption?.name}
                    image={visibleMealOption ? (visibleMealOption.thumbnailURL ? visibleMealOption.thumbnailURL : img) : img}
                />
            </section>

            <CardActions className="card-actions" disableSpacing>
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
                    {locked ? <Lock style={{color: "deeppink"}} /> : <LockOpen />}
                </IconButton>
            </CardActions>
        </Card>
    );
}