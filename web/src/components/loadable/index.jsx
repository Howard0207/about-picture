import React, { Suspense } from "react";
function Loadable(props) {
    const { loader, Loading } = props;
    const ProfilePage = React.lazy(() => {
        import(/* webpackPrefetch: true */ "../picture/compress");
    }); // 懒加载
    return (
        <Suspense fallback={<Loading />}>
            <ProfilePage />
        </Suspense>
    );
}
export default (props) => {
    <Loadable {...props} />;
};
