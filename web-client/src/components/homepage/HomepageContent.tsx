import React from "react";
import {
    Grid,
    Stack,
    Typography,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
} from "@mui/material";
import challengeUserThumbnail from "../../assets/images/challenge_user_thumbnail.jpg";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IStore } from "../../app/store";
import { useAlert } from "../../hooks/use-alert";

interface ICustomCardButtonProps {
    title: string;
    body: string;
    src: string;
    alt: string;
    onClick?: () => void;
}

const CustomCardButton: React.FC<ICustomCardButtonProps> = ({
    title,
    body,
    src,
    alt,
    onClick,
}) => {
    return (
        <Card>
            <CardActionArea onClick={onClick}>
                <CardMedia component="img" image={src} alt={alt} />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {body}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

const HomepageContent = () => {
    const navigate = useNavigate();
    const alert = useAlert();
    const userid = useSelector<IStore, string>((state) => state.user.userid);

    const cardClickHandler = (url: string) => {
        if (userid === "") return alert.info("Login to challenge");
        navigate(url);
    };

    return (
        <Stack mx={{sm: 4, md: 16}} my={4}>
            <Grid container rowSpacing={4} columnSpacing={4}>
                <Grid item xs={12}>
                    <Typography variant="h2" textAlign="center">Welcome</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <CustomCardButton
                        title="Challenge User"
                        body="Challenge other users directly"
                        src={challengeUserThumbnail}
                        alt="challange user"
                        onClick={() => cardClickHandler("/challenge-user")}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <CustomCardButton
                        title="Open Challenge"
                        body="Create challenges open to all or accept them"
                        src={challengeUserThumbnail}
                        alt="open challenge"
                        onClick={() => cardClickHandler("/open-challenge")}
                    />
                </Grid>
            </Grid>
        </Stack>
    );
};

export default HomepageContent;
