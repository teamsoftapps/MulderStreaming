import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Video from 'react-native-video';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useGetExclusiveContentMutation} from '../store/Api/Auth';

interface Item {
  videolink: string;
  text: string;
  thumbnail: string;
}

const HorizontalFlatList: React.FC = () => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [GetExclusiveContent] = useGetExclusiveContentMutation();
  const [isContent, setContent] = useState<Item[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState('');

  const fetchExclusive = async () => {
    try {
      const res = await GetExclusiveContent();
      console.log('video data fetched==>', res?.data?.data);
      const fetchedData = res?.data?.data.map((item: any) => ({
        videolink: item.videolink,
        thumbnail: item.thumbnail,
        text: item.text,
      }));
      setContent(fetchedData);
    } catch (error) {
      console.log('Error in exclusive content', error);
    }
  };
  useEffect(() => {
    fetchExclusive();
  }, []);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const nextIndex = (currentIndex + 1) % isContent.length;
  //     setCurrentIndex(nextIndex);
  //     flatListRef.current?.scrollToIndex({
  //       index: nextIndex,
  //       animated: true,
  //     });
  //   }, 4000);

  //   return () => clearInterval(interval);
  // }, [currentIndex, isContent.length]);

  useEffect(() => {
    if (isContent.length === 0) return; // Prevent interval from running when there is no data

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % isContent.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isContent.length]);

  const renderItem = ({item}: {item: Item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedVideo(item.videolink);
          setModalVisible(true);
        }}>
        <View style={styles.videoThumbnailContainer}>
          <Image source={{uri: item.thumbnail}} style={styles.videoThumbnail} />

          <Text style={styles.playIcon}>▶</Text>
        </View>
        {/* <Text style={styles.videoText}>{item.text}</Text> */}
      </TouchableOpacity>
    );
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / responsiveWidth(85));
    setCurrentIndex(index);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={isContent}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.flatList}
        />
      </View>
      <View style={styles.paginationContainer}>
        {isContent.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>

      {/* Modal for Video Playback */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>✖</Text>
          </TouchableOpacity>
          <Video
            source={{uri: selectedVideo}}
            style={styles.modalVideo}
            controls
            resizeMode="contain"
            repeat
            onError={error => console.log('Video Error: ', error)}
          />
          <Text style={styles.modalVideoText}>
            {isContent.find(item => item.videolink === selectedVideo)?.text}
          </Text>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  flatList: {
    flex: 1,
    borderRadius: responsiveWidth(3),
  },
  videoThumbnailContainer: {
    position: 'relative',
    height: responsiveHeight(25),
    width: responsiveWidth(87),
    borderRadius: responsiveWidth(3),
    overflow: 'hidden',
    marginRight: responsiveWidth(2),
  },
  videoThumbnail: {
    height: '100%',
    width: '100%',
    objectFit: 'fill',
    borderRadius: responsiveWidth(3),
  },
  playIcon: {
    position: 'absolute',
    top: '35%',
    left: '45%',
    fontSize: 40,
    color: '#fff',
    zIndex: 1,
  },
  videoText: {
    textAlign: 'center',
    marginTop: responsiveHeight(1),
    color: '#fff',
    fontSize: responsiveFontSize(2),
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
  },
  dot: {
    width: responsiveWidth(2),
    height: responsiveHeight(1),
    borderRadius: responsiveWidth(10),
    backgroundColor: '#ccc',
    marginHorizontal: responsiveWidth(0.8),
  },
  activeDot: {
    backgroundColor: '#9D824F',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  modalVideo: {
    width: '90%',
    height: '40%',
    marginBottom: responsiveHeight(2),
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 1,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(3),
  },
  modalVideoText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: responsiveFontSize(2),
    marginTop: responsiveHeight(1),
  },
});

export default HorizontalFlatList;
