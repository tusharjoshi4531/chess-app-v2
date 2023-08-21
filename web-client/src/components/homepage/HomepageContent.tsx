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
    return (
        <Stack>
            <Grid container rowSpacing={4} columnSpacing={4}>
                <Grid item xs={12}>
                    <Typography variant="h2">Welcome</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <CustomCardButton
                        title="Challenge User"
                        body="Challenge other users directly"
                        src={challengeUserThumbnail}
                        alt="challange user"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <CustomCardButton
                        title="Open Challenge"
                        body="Create challenges open to all or accept them"
                        src={challengeUserThumbnail}
                        alt="open challenge"
                    />
                </Grid>
            </Grid>
        </Stack>
    );
};

export default HomepageContent;
